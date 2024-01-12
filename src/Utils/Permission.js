import { PermissionsAndroid } from "react-native"
export const getStoragePermissions = async () => {
    const permissions = await PermissionsAndroid.requestMultiple(["android.permission.READ_MEDIA_AUDIO", "android.permission.READ_EXTERNAL_STORAGE", "android.permission.READ_MEDIA_VIDEO", "android.permission.READ_MEDIA_IMAGES", "android.permission.ACCESS_FINE_LOCATION"]);
    console.log(permissions);
}