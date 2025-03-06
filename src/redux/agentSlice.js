import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const fetchQuestions = createAsyncThunk(
  "agent/fetchQuestions",
  async (userId) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/app-agent/questions`,
    );
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },
);

export const createQuestion = createAsyncThunk(
  "agent/createQuestion",
  async ({ userId, content }) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/app-agent/questions`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
    );
    if (!response.ok) throw new Error("Failed to create question");
    return response.json();
  },
);

export const fetchAnswers = createAsyncThunk(
  "agent/fetchAnswers",
  async ({ userId, questionId }) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/app-agent/questions/${questionId}/answers`,
    );
    if (!response.ok) throw new Error("Failed to fetch answers");
    return { questionId, answers: await response.json() };
  },
);

export const createAnswer = createAsyncThunk(
  "agent/createAnswer",
  async ({ userId, questionId, content }) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/app-agent/questions/${questionId}/answers`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
    );
    if (!response.ok) throw new Error("Failed to create answer");
    return response.json();
  },
);

export const loadAppAgentConversation = createAsyncThunk(
  "agent/loadAppAgentConversation",
  async (userId) => {
    // First fetch all questions
    const questionsResponse = await fetch(
      `/api/supabase/users/${userId}/app-agent/questions`,
    );
    if (!questionsResponse.ok) throw new Error("Failed to fetch questions");
    const questions = await questionsResponse.json();

    // Then fetch answers for each question
    const answersPromises = questions.map(async (question) => {
      const answersResponse = await fetch(
        `/api/supabase/users/${userId}/app-agent/questions/${question.id}/answers`,
      );
      if (!answersResponse.ok) throw new Error("Failed to fetch answers");
      const answers = await answersResponse.json();
      return { questionId: question.id, answers };
    });

    const answers = await Promise.all(answersPromises);
    return { questions, answers };
  },
);

// Add the new thunk for generating answers
export const generateAnswer = createAsyncThunk(
  "agent/generateAnswer",
  async ({ userId, message }, { dispatch, getState }) => {
    const initResponse = await fetch(`/api/supabase/users/${userId}/app-agent`);
    if (!initResponse.ok) throw new Error("Failed to initialize agent");

    // First generate the answer from the AI
    const response = await fetch(`/api/supabase/users/${userId}/app-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error("Failed to generate answer");
    const data = await response.json();

    // Get the last question's ID from the state
    const state = getState();
    const lastQuestion =
      state.agent.questions[state.agent.questions.length - 1];
    const questionId = lastQuestion.id;

    // Then create the answer in the database
    await dispatch(
      createAnswer({
        userId,
        questionId,
        content: data.response,
      }),
    );

    return {
      response: data.response,
      redirectPage: data.redirectPage,
    };
  },
);

// First the initial state remains the same
const initialState = {
  questions: [],
  questionAnswerMap: {}, // { questionId: [answers] }
  currentRedirectPage: "",
  loadingStates: {
    fetchingQuestions: false,
    creatingQuestion: false,
    fetchingAnswers: false,
    creatingAnswer: false,
    loadingConversation: false,
    generatingAnswer: false, // Add new loading state
  },
  error: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setRedirectPage: (state, action) => {
      state.currentRedirectPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Answer
      .addCase(generateAnswer.pending, (state) => {
        state.loadingStates.generatingAnswer = true;
        state.error = null;
      })
      .addCase(generateAnswer.fulfilled, (state, action) => {
        state.loadingStates.generatingAnswer = false;
        state.currentRedirectPage = action.payload.redirectPage;
      })
      .addCase(generateAnswer.rejected, (state, action) => {
        state.loadingStates.generatingAnswer = false;
        state.error = action.error.message;
      })

      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loadingStates.fetchingQuestions = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loadingStates.fetchingQuestions = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loadingStates.fetchingQuestions = false;
        state.error = action.error.message;
      })

      // Load Conversation
      .addCase(loadAppAgentConversation.pending, (state) => {
        state.loadingStates.loadingConversation = true;
        state.error = null;
      })
      .addCase(loadAppAgentConversation.fulfilled, (state, action) => {
        state.loadingStates.loadingConversation = false;
        state.questions = action.payload.questions;
        action.payload.answers.forEach(({ questionId, answers }) => {
          state.questionAnswerMap[questionId] = answers;
        });
      })
      .addCase(loadAppAgentConversation.rejected, (state, action) => {
        state.loadingStates.loadingConversation = false;
        state.error = action.error.message;
      })

      // Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loadingStates.creatingQuestion = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loadingStates.creatingQuestion = false;
        state.questions.push(action.payload);
        state.questionAnswerMap[action.payload.id] = [];
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loadingStates.creatingQuestion = false;
        state.error = action.error.message;
      })

      // Fetch Answers
      .addCase(fetchAnswers.pending, (state) => {
        state.loadingStates.fetchingAnswers = true;
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loadingStates.fetchingAnswers = false;
        state.questionAnswerMap[action.payload.questionId] =
          action.payload.answers;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loadingStates.fetchingAnswers = false;
        state.error = action.error.message;
      })

      // Create Answer
      .addCase(createAnswer.pending, (state) => {
        state.loadingStates.creatingAnswer = true;
        state.error = null;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.loadingStates.creatingAnswer = false;
        const questionId = action.payload.question_id;
        if (!state.questionAnswerMap[questionId]) {
          state.questionAnswerMap[questionId] = [];
        }
        state.questionAnswerMap[questionId].push(action.payload);
      })
      .addCase(createAnswer.rejected, (state, action) => {
        state.loadingStates.creatingAnswer = false;
        state.error = action.error.message;
      });
  },
});

export const { setRedirectPage, clearError } = agentSlice.actions;
export default agentSlice.reducer;
