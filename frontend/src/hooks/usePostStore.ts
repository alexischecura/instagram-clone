import { AxiosError } from 'axios';
import { getFolloweesPost } from '../api/postApi';
import {
  reportPostError,
  startPostRequest,
  setLoadedPosts,
  loadMorePost,
} from '../store/post/postSlice';
import { useAppDispatch, useAppSelector } from './reduxHooks';

export const usePostStore = () => {
  const dispatch = useAppDispatch();

  const { followeesPosts, isLoadingPost, page } = useAppSelector(
    (state) => state.post
  );

  const startGettingFolloweesPost = async () => {
    dispatch(startPostRequest());
    try {
      const posts = await getFolloweesPost(1, 3);
      dispatch(setLoadedPosts(posts));
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          reportPostError(
            error.response?.data?.message ||
              'Something went wrong trying to get followees post'
          )
        );
      }
    }
  };

  const startLoadingMorePost = async () => {
    try {
      const posts = await getFolloweesPost(page, 3);
      if (!posts) {
        return;
      }
      dispatch(loadMorePost(posts));
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          reportPostError(
            error.response?.data?.message ||
              'Something went wrong trying to get followees post'
          )
        );
      }
    }
  };

  return {
    isLoadingPost,
    followeesPosts,
    page,
    startGettingFolloweesPost,
    startLoadingMorePost,
  };
};
