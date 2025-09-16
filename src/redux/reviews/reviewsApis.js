import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = "https://darbapi-production.up.railway.app/products";

const updateRating = (reviews) => {
  const ratingList = reviews.map((r) => r.rating);
  const rateSum = ratingList.reduce((prev, current) => {
    return prev + current;
  }, 0);
  return (rateSum / ratingList.length).toFixed(1);
};

const addReview = async ({ productId, reviewData }) => {
  try {
    const { data } = await axios.get(`${URL}/${productId}`);
    const updatedReviews = [reviewData, ...data.reviews];
    const productRate = updateRating(updatedReviews);
    const res = await axios.patch(`${URL}/${productId}`, {
      reviews: updatedReviews,
      rating: productRate,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const useAddReview = (productId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => addReview({ productId, reviewData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["productReviews", productId]);
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

const updateReview = async ({ productId, reviewData }) => {
  try {
    const { data } = await axios.get(`${URL}/${productId}`);
    const updatedReviews = data.reviews.map((review) => (review.clientId === reviewData.clientId ? reviewData : review));
    const productRate = updateRating(updatedReviews);
    const res = await axios.patch(`${URL}/${productId}`, {
      reviews: updatedReviews,
      rating: productRate,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const useUpdateReview = (productId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => updateReview({ productId, reviewData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["productReviews", productId]);
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};
