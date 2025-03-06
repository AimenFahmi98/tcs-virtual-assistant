import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* CONVERSATIONS */

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (userId) => {
    const response = await fetch(`/api/supabase/users/${userId}/conversations`);
    return await response.json();
  },
);

export const createNewEmptyConversation = createAsyncThunk(
  "chat/createNewEmptyConversation",
  async ({ userId }) => {
    const createConversationResponse = await fetch(
      `/api/supabase/users/${userId}/conversations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Conversation" }),
      },
    );
    return await createConversationResponse.json();
  },
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async ({ userId, conversationId }) => {
    const deleteConversationResponse = await fetch(
      `/api/supabase/users/${userId}/conversations/${conversationId}`,
      {
        method: "DELETE",
      },
    );
    return await deleteConversationResponse.json();
  },
);

/* QUESTIONS AND ANSWERS */

export const fetchQuestionsAndAnswers = createAsyncThunk(
  "chat/fetchQuestionsAndAnswers",
  async ({ userId, conversationId }) => {
    const questionsResponse = await fetch(
      `/api/supabase/users/${userId}/conversations/${conversationId}/questions`,
    );
    const questions = await questionsResponse.json();

    const questionAnswerMap = {};
    for (const question of questions) {
      const answersResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}/questions/${question.id}/answers`,
      );
      const answers = await answersResponse.json();
      questionAnswerMap[question.id] = {
        question,
        answers,
      };
    }

    return { questionAnswerMap };
  },
);

export const deleteQuestion = createAsyncThunk(
  "chat/deleteQuestion",
  async ({ userId, conversationId, questionId }, { dispatch }) => {
    dispatch(setQuestionIdBeingDeleted(questionId));
    const deleteQuestionResponse = await fetch(
      `/api/supabase/users/${userId}/conversations/${conversationId}/questions/${questionId}`,
      {
        method: "DELETE",
      },
    );
    return await deleteQuestionResponse.json();
  },
);

export const submitQuestion = createAsyncThunk(
  "chat/submitQuestion",
  async (
    { question, user, RAGDocumentIds, RAGDocumentNames },
    { rejectWithValue, getState, dispatch },
  ) => {
    if (!question) return rejectWithValue("No question provided");

    const userId = user.id;
    const isAdmin = user.roles.some((role) => role.name === "Admin");

    const conversationId = getState().chat.activeConversationId;

    try {
      // Store question first
      const questionResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: question }),
        },
      );
      const newQuestion = await questionResponse.json();

      // Create empty answer
      const answerResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}/questions/${newQuestion.id}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "" }),
        },
      );

      let newAnswer = await answerResponse.json();

      dispatch(addNewQuestion({ question: newQuestion, answer: newAnswer }));

      // Start streaming response
      const openaiResponse = await fetch("/api/openai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          question: newQuestion.content,
          activeConversationId: conversationId,
          RAGDocumentIds: RAGDocumentIds,
          RAGDocumentNames: RAGDocumentNames,
        }),
      });

      if (!openaiResponse.ok)
        throw new Error(`HTTP error! status: ${openaiResponse.status}`);

      let redirectPage = openaiResponse.headers.get("X-Redirect-Page");
      const reader = openaiResponse.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = "";

      if (redirectPage.includes("admin-settings") && !isAdmin) {
        fullAnswer = "You do not have permission to access this page.";
        redirectPage = "";
        dispatch(
          updateAnswer({
            questionId: newQuestion.id,
            content: fullAnswer,
          }),
        );
      } else {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          // Decode streamed content
          const chunk = decoder.decode(value, { stream: true });
          fullAnswer += chunk;

          // Dispatch partial answer to Redux store
          dispatch(
            updateAnswer({
              questionId: newQuestion.id,
              content: fullAnswer,
            }),
          );
        }
      }

      const titleResponse = await fetch(
        `/api/openai?conversationId=${conversationId}&userId=${userId}`,
      );
      if (!titleResponse.ok)
        throw new Error("Failed to fetch conversation title");

      const { newConversationTitle, filesUsed } = await titleResponse.json();
      dispatch(setRAGFilesUsedInLastRequest(filesUsed));

      const updateConversationTitleResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newConversationTitle }),
        },
      );

      if (!updateConversationTitleResponse.ok)
        throw new Error("Failed to update conversation title");

      dispatch(updateConversationTitle({ newTitle: newConversationTitle }));

      const finalAnswer = {
        ...newAnswer,
        content: fullAnswer,
        filesUsedAsContext: filesUsed,
      };

      const storeFullAnswerResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}/questions/${newQuestion.id}/answers/${newAnswer.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: finalAnswer.content,
            filesUsedAsContext: finalAnswer.filesUsedAsContext,
          }),
        },
      );

      if (!storeFullAnswerResponse.ok)
        throw new Error("Failed to store full answer");

      return { question: newQuestion, answer: finalAnswer, redirectPage };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeConversationId: null,
    conversations: [],
    isFetchingConversations: true,
    isCreatingNewEmptyConversation: false,
    isDeletingConversation: false,
    questionAnswerMap: {},
    RAGFilesUsedInLastRequest: [],
    aboutToDeleteQuestion: -1,
    isGeneratingAnswer: false,
    isFetchingQuestions: true,
    questionIdBeingDeleted: -1,
    redirectPage: "",
    error: null,
  },
  reducers: {
    setActiveConversationId: (state, action) => {
      state.activeConversationId = action.payload;
    },
    updateConversationTitle: (state, action) => {
      const conversation = state.conversations.find(
        (conversation) => conversation.id === state.activeConversationId,
      );
      if (conversation) {
        conversation.title = action.payload.newTitle;
      }
    },
    setAboutToDeleteQuestion: (state, action) => {
      state.aboutToDeleteQuestion = action.payload;
    },
    updateAnswer: (state, action) => {
      if (state.questionAnswerMap[action.payload.questionId]?.answers?.[0]) {
        state.questionAnswerMap[action.payload.questionId].answers[0].content =
          action.payload.content;
      }
    },
    setRAGFilesUsedInLastRequest: (state, action) => {
      state.RAGFilesUsedInLastRequest = action.payload;
    },
    addNewQuestion: (state, action) => {
      state.questionAnswerMap[action.payload.question.id] = {
        question: action.payload.question,
        answers: [action.payload.answer],
      };
    },
    setRedirectPage: (state, action) => {
      state.redirectPage = action.payload;
    },
    setQuestionIdBeingDeleted: (state, action) => {
      state.questionIdBeingDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isFetchingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isFetchingConversations = false;
        state.conversations = action.payload;
        if (action.payload.length > 0) {
          state.activeConversationId = action.payload[0].id;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isFetchingConversations = false;
        state.error = action.error.message;
      })
      .addCase(fetchQuestionsAndAnswers.pending, (state) => {
        state.isFetchingQuestions = true;
        state.error = null;
      })
      .addCase(fetchQuestionsAndAnswers.fulfilled, (state, action) => {
        state.isFetchingQuestions = false;
        state.questionAnswerMap = action.payload.questionAnswerMap;
        state.error = null;
      })
      .addCase(fetchQuestionsAndAnswers.rejected, (state, action) => {
        state.isFetchingQuestions = false;
        state.error = action.error.message;
      })
      .addCase(deleteConversation.pending, (state) => {
        state.isDeletingConversation = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.isDeletingConversation = false;
        state.conversations = state.conversations.filter(
          (conversation) => conversation.id !== action.payload.id,
        );
        if (state.activeConversationId === action.payload.id) {
          state.activeConversationId = state.conversations[0]?.id || null;
        }
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.isDeletingConversation = false;
        state.error = action.error.message;
      })
      .addCase(createNewEmptyConversation.pending, (state) => {
        state.isCreatingNewEmptyConversation = true;
        state.error = null;
      })
      .addCase(createNewEmptyConversation.fulfilled, (state, action) => {
        state.isCreatingNewEmptyConversation = false;
        state.conversations.unshift(action.payload);
        state.activeConversationId = action.payload.id;
      })
      .addCase(createNewEmptyConversation.rejected, (state, action) => {
        state.isCreatingNewEmptyConversation = false;
        state.error = action.error.message;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questionIdBeingDeleted = -1;
        delete state.questionAnswerMap[action.payload.id];
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.questionIdBeingDeleted = -1;
        state.error = action.error.message;
      })
      .addCase(submitQuestion.pending, (state) => {
        state.isGeneratingAnswer = true;
        state.redirectPage = "";
        state.error = null;
      })
      .addCase(submitQuestion.fulfilled, (state, action) => {
        state.isGeneratingAnswer = false;
        state.questionAnswerMap[action.payload.question.id] = {
          question: action.payload.question,
          answers: [action.payload.answer],
        };
        if (action.payload.redirectPage) {
          state.redirectPage = action.payload.redirectPage;
        }
      })
      .addCase(submitQuestion.rejected, (state, action) => {
        state.isGeneratingAnswer = false;
        state.redirectPage = "";
        state.error = action.error.message;
      });
  },
});

export const {
  setActiveConversationId,
  setAboutToDeleteQuestion,
  updateAnswer,
  addNewQuestion,
  updateConversationTitle,
  setRAGFilesUsedInLastRequest,
  setRedirectPage,
  setQuestionIdBeingDeleted,
} = chatSlice.actions;

export default chatSlice.reducer;
