const USERS_KEY = "product-viewer:users";
const CURRENT_USER_KEY = "product-viewer:currentUser";

export class AuthService {
  getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }

  register({ username, password }) {
    const users = this.getUsers();

    const exists = users.some((user) => user.username === username);

    if (exists) {
      return { error: "Username is already taken." };
    }

    const user = { username, password };

    users.push(user);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { user };
  }

  login(username, password) {
    const user = this.getUsers().find((item) => item.username === username && item.password === password);

    if (!user) {
      return { error: "Invalid username or password." };
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    return { user };
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
  }

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}