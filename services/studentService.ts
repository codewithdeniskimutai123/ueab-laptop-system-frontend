import API from "./api";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";


export const getMyLaptop = async () => {
  try {
    const response = await API.get("/laptops/my_laptop/");
    return response.data;
  } catch (error: any) {
    console.log("MY LAPTOP ERROR:", error.response?.data);
    throw error.response?.data || error;
  }
};

export const downloadQr = async (laptopId: number) => {
  const endpoint = `laptops/download_qr/${laptopId}/`;


  if (typeof window !== "undefined") {
    try {
      const response = await API.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "image/png",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `qr_${laptopId}.png`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.log("WEB DOWNLOAD ERROR:", err);
      throw err;
    }
  }


  try {
    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission to access gallery denied");
    }

    const url =
      `${API.defaults.baseURL}${endpoint}`;

    const fileUri =
      `${FileSystem.documentDirectory}qr_${laptopId}.png`;

    const downloadResult =
      await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization:
            API.defaults.headers.common.Authorization || "",
        },
      });

    const asset =
      await MediaLibrary.createAssetAsync(downloadResult.uri);

    const albumName = "Laptop QR Codes";

    const existingAlbum =
      await MediaLibrary.getAlbumAsync(albumName);

    if (!existingAlbum) {
      await MediaLibrary.createAlbumAsync(
        albumName,
        asset,
        false
      );
    } else {
      await MediaLibrary.addAssetsToAlbumAsync(
        [asset],
        existingAlbum,
        false
      );
    }

    await FileSystem.deleteAsync(fileUri, {
      idempotent: true,
    });

    return downloadResult.uri;
  } catch (error) {
    console.log("QR DOWNLOAD ERROR:", error);
    throw error;
  }
};


 export const getMyTransactions = async () => {
  const response = await API.get("/transactions/my_transactions/");
  return response.data;
};



export const searchStudent = async (
  query: string
) => {
  try {
    const response = await API.get(
      `/users/search_student/?query=${query}`
    );

    return response.data;
  } catch (error: any) {
    console.log(
      "SEARCH STUDENT ERROR:",
      error.response?.data
    );

    throw error.response?.data || error;
  }
};

export const transferLaptop =
  async (
    laptopId: number,
    newHolderId: number
  ) => {
    try {
      const response =
        await API.post(
          "/transactions/transfer/",
          {
            laptop_id: laptopId,
            new_holder_id: newHolderId,
          }
        );

      return response.data;
    } catch (error: any) {
      console.log(
        "TRANSFER ERROR:",
        error.response?.data
      );

      throw (
        error.response?.data ||
        error
      );
    }
  };

 