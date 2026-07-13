import { 
  auth, 
  dbFirestore, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc 
} from './firebase.js';

// Gestione del Login del Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('error-message');
        const btnSubmit = document.getElementById('btn-submit');

        try {
            btnSubmit.disabled = true;
            errorDiv.style.display = "none";
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html"; // Redirect to Sala
        } catch (error) {
            errorDiv.innerText = "Credenziali non valide o errore di rete.";
            errorDiv.style.display = "flex";
            btnSubmit.disabled = false;
        }
    });
}

// Gestione Login con Google
const btnGoogle = document.getElementById('btn-google');
if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
        const errorDiv = document.getElementById('error-message');
        try {
            errorDiv.style.display = "none";
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Controllo se l'utente ha già un ruolo associato su Firestore
            const userDocRef = doc(dbFirestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Se è un nuovo utente, crea il profilo inizializzandolo come 'employee'
                await setDoc(userDocRef, {
                    name: user.displayName || "Nuovo Dipendente",
                    email: user.email,
                    role: "employee", // Ruolo di default protetto
                    createdAt: new Date()
                });
            }

            window.location.href = "index.html"; // Redirect to Sala
        } catch (error) {
            errorDiv.innerText = "Accesso con Google annullato o fallito.";
            errorDiv.style.display = "flex";
            console.error(error);
        }
    });
}

// Gestione del Logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });
}

/**
 * Ascoltatore dello stato di autenticazione per la protezione delle rotte lato client
 */
export function checkAuthState(onUserValidated) {
    onAuthStateChanged(auth, async (user) => {
        const isLoginPage = window.location.pathname.includes("login.html") || window.location.pathname === "/" || window.location.pathname === "";
        
        if (!user) {
            if (!isLoginPage) window.location.href = "login.html";
            return;
        }

        try {
            const userDoc = await getDoc(doc(dbFirestore, "users", user.uid));
            if (!userDoc.exists()) {
                if (!isLoginPage) window.location.href = "login.html";
                return;
            }

            const userData = userDoc.data();
            const payload = { uid: user.uid, name: userData.name, email: user.email, role: userData.role };

            if (isLoginPage) {
                window.location.href = "index.html";
            } else {
                onUserValidated(payload);
            }
        } catch (err) {
            console.error("Auth error:", err);
            if (!isLoginPage) window.location.href = "login.html";
        }
    });
}