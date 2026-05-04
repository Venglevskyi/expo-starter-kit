import { getAuth, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const firebaseAuth = getAuth();
export const firebaseDb = getFirestore();

export type FirebaseUser = FirebaseAuthTypes.User;
export type FirebaseAuthError = FirebaseAuthTypes.NativeFirebaseAuthError;
