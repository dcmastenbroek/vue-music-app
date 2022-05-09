import { defineStore } from "pinia";
import { auth, db } from "@/plugins/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useAuthStore = defineStore({
  id: "auth",

  state: () => ({
    user: null,
    isLoggedIn: false,
  }),

  getters: {
    getCurrentUser() {
      return auth.currentUser;
    },
  },

  actions: {
    handleRegistration(data) {
      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
          .then(async (userCredentials) => {
            this.user = userCredentials.user;

            await setDoc(doc(db, "users", userCredentials.user.uid), {
              name: data.name,
              email: data.email,
              age: data.age,
              country: data.country,
            });

            // Setting the user's display name
            await updateProfile(userCredentials.user, {
              displayName: data.name,
            });

            // Redirecting to manage page
            this.router.push({ name: "manage" });

            resolve(userCredentials);
          })
          .catch((error) => {
            console.log("An error happened.", error);
            reject(error);
          });
      });
    },

    handleLogin(data) {
      return signInWithEmailAndPassword(auth, data.email, data.password);
    },

    handleLogout() {
      signOut(auth)
        .then(() => {
          this.router.push({ name: "home" });
        })
        .catch((error) => {
          console.log("An error happened.", error);
        });
    },

    initializeAuthentication() {
      const user = this.getCurrentUser;

      if (user) {
        this.user = user;
        this.isLoggedIn = true;
      } else {
        this.user = null;
        this.isLoggedIn = false;
      }
    },
  },
});
