import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "@firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase";

export const fetchPosts = createAsyncThunk("blog/fetchPosts", async () => {
  const querySnapshot = await getDocs(collection(db, "boards"));

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const fetchPost = createAsyncThunk(
  "blog/fetchPost",
  async (id) => {
    const postRef = doc(db, "boards", id);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot.exists()) {

      return { id: postSnapshot.id, ...postSnapshot.data() };
    } else {
      throw new Error("Boards not found");
    }
  }
);

export const createPost = createAsyncThunk(
  "blog/createPost",
  async (postData) => {
    const docRef = await addDoc(collection(db, "boards"), postData);
    return { id: docRef.id, ...postData };
  }
);

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async ({ id, newBoard }) => {
    const postRef = doc(db, "boards", id);
    await updateDoc(postRef, {board: newBoard});
    return { id, newBoard };
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (id) => {
    const postRef = doc(db, "boards", id);
    await deleteDoc(postRef);
    return id;
  }
);






const initialState = {
  loading: false,
  error: false,
  boards: []

}

export const boardsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending ]: (state) => {
      state.loading = true;
    },
    [fetchPosts.fulfilled ]: (state, action) => {
      state.loading = false;
      state.boards = action.payload;
    },
    [fetchPosts.rejected ]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [fetchPost.pending ]: (state) => {
      state.loading = true;
    },
    [fetchPost.fulfilled ]: (state, action) => {
      state.loading = false
      const existsPost = state.boards.find(
        (board) => board.id === action.payload.id
      );

      if (!existsPost) {
        state.boards.push(action.payload);
      }
    },
    [fetchPost.rejected ]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [createPost.pending ]: (state) => {
      state.loading = true;
    },
    [createPost.fulfilled ]: (state, action) => {
      state.loading = false;
      state.boards.push(action.payload );
    },
    [createPost.rejected ]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [updatePost.pending ]: (state) => {
      state.loading = true;
    },
    [updatePost.fulfilled ]: (state, action) => {
      state.loading = false;
      const index = state.boards.findIndex(
        (post) => post.id === action.payload.id
      );

      if (index !== -1) {
        state.boards[index] = {id: action.payload.id, board: action.payload.newBoard};
      }
    },
    [updatePost.rejected ]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [deletePost.pending ]: (state) => {
      state.loading = true;
    },
    [deletePost.fulfilled ]: (state, action) => {
      state.loading = false;
      state.boards = state.boards.filter(
        (post) => post.id !== action.payload
      );
    },
    [deletePost.rejected ]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  }
})

export default boardsSlice.reducer;