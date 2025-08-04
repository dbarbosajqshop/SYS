import { db } from "@/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export const uploadImage = async (entity: string, id: string, file: File) => {
  const fileName = `${v4()}-${file.name}`;

  const storageRef = ref(db, `${entity}/${id}/${fileName}`);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
