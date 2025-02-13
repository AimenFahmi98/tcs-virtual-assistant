import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";

// Async thunks
export const fetchUser = createAsyncThunk("chat/fetchUser", async () => {
  const supabase = createClient();
  const response = await supabase.auth.getUser();
  return response.data?.user;
});

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (userId) => {
    const response = await fetch(`/api/supabase/users/${userId}/conversations`);
    return await response.json();
  },
);

export const fetchQuestionsAndAnswers = createAsyncThunk(
  "chat/fetchQuestionsAndAnswers",
  async ({ userId, conversationId }) => {
    const questionsResponse = await fetch(
      `/api/supabase/users/${userId}/conversations/${conversationId}/questions`,
    );
    const questions = await questionsResponse.json();

    const answersPromises = questions.map(async (question) => {
      const answersResponse = await fetch(
        `/api/supabase/users/${userId}/conversations/${conversationId}/questions/${question.id}/answers`,
      );
      return answersResponse.json();
    });

    const answers = (await Promise.all(answersPromises)).flat();
    return { questions, answers };
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    user: null,
    conversations: [],
    activeConversationId: null,
    questions: [],
    answers: [],
    documents: [],
    isLoading: false,
    isGeneratingAnswer: false,
    isFetchingConversations: false,
    isFetchingQuestions: false,
    intentionToDeleteQuestion: { questionId: -1 },
    hasQuestions: false,
  },
  reducers: {
    setActiveConversationId: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    updateConversationTitle: (state, action) => {
      const { id, title } = action.payload;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) conversation.title = title;
    },
    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload,
      );
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
      state.hasQuestions = true;
    },
    removeQuestion: (state, action) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
      state.hasQuestions = state.questions.length > 0;
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    updateAnswer: (state, action) => {
      const { id, content, filesUsedAsContext } = action.payload;
      const answer = state.answers.find((a) => a.id === id);
      if (answer) {
        answer.content = content;
        answer.filesUsedAsContext = filesUsedAsContext;
      }
    },
    setIsGeneratingAnswer: (state, action) => {
      state.isGeneratingAnswer = action.payload;
    },
    setIntentionToDeleteQuestion: (state, action) => {
      state.intentionToDeleteQuestion = action.payload;
    },
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchConversations.pending, (state) => {
        state.isFetchingConversations = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isFetchingConversations = false;
        state.conversations = action.payload;
        if (action.payload.length > 0) {
          state.activeConversationId = action.payload[0].id;
        }
      })
      .addCase(fetchQuestionsAndAnswers.pending, (state) => {
        state.isFetchingQuestions = true;
      })
      .addCase(fetchQuestionsAndAnswers.fulfilled, (state, action) => {
        state.isFetchingQuestions = false;
        state.questions = action.payload.questions;
        state.answers = action.payload.answers;
        state.hasQuestions = action.payload.questions.length > 0;
      });
  },
});

export const {
  setActiveConversationId,
  addConversation,
  updateConversationTitle,
  deleteConversation,
  addQuestion,
  removeQuestion,
  addAnswer,
  updateAnswer,
  setIsGeneratingAnswer,
  setIntentionToDeleteQuestion,
  setDocuments,
} = chatSlice.actions;

export default chatSlice.reducer;
