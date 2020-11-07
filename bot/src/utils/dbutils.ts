import { Question } from "../automations/qotd";
import * as admin from "firebase-admin";

export const getNextQOTD = async (): Promise<Question> => {
  const snapshot = await admin.firestore().doc("/bot/status").get();
  const currentQOTD = (snapshot.data() as any).currentQOTD;

  console.log(currentQOTD);

  const qotdSnapshot = await admin
    .firestore()
    .collection("qotd")
    .doc(`${currentQOTD}`)
    .get();
  const data = qotdSnapshot.data();
  if (data === undefined) {
    return undefined;
  }
  return {
    question: data.question as string,
    number: currentQOTD,
  };
};

export const incrementQOTD = async (): Promise<number> => {
  const doc = await admin.firestore().collection("bot").doc("status");

  const res = await doc.update({
    currentQOTD: admin.firestore.FieldValue.increment(1),
  });

  return (await doc.get()).data().currentQOTD;
};

export const hasNextQOTD = async (): Promise<boolean> => {
  return (await getNextQOTD()) !== undefined;
};

export const getQOTDChannel = async (): Promise<string> => {
  const snapshot = await admin
    .firestore()
    .collection("bot")
    .doc("status")
    .get();
  const channelID = (snapshot.data() as any).qotdchannel;
  return channelID;
};

export const getModChannel = async (): Promise<string> => {
  const snapshot = await admin
    .firestore()
    .collection("bot")
    .doc("status")
    .get();
  const channelID = (snapshot.data() as any).modchannel;
  return channelID;
};

export const getServerID = async (): Promise<string> => {
  const snapshot = await admin
    .firestore()
    .collection("bot")
    .doc("status")
    .get();
  const channelID = (snapshot.data() as any).serverid;
  return channelID;
};
