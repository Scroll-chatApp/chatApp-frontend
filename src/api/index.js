import axios from "axios";
import { ENDPOINT } from "../constant";

const API = axios.create({ baseURL: ENDPOINT });

export const conversationIdFetch = async (senderId, receiverId) => {
  try {
    const conversation = await API.get(
      `/getallconversationofuser/${senderId}/${receiverId}`
    );
    return conversation.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
  }
};

export const fetchAllMessages = async  (conversationId) => {
  const response = await API.get(`/getmessage/${conversationId}`);
  const fetchedMessage = response.data;
  return fetchedMessage;
};

export const createNewConversation = async  (senderId, receiverId) => {
  const createConversation = await API.post(
    `/newconversation/${senderId}/${receiverId}`
  );
  return createConversation;
};

export const fetchAllUser = async  () => {
  const response = await API.get(`/getallusers`);
  return response.data;
};
