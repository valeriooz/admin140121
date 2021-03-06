import Vue from "vue";
import Router from "vue-router";
import multiguard from "vue-router-multiguard";
import Home from "../views/Home";
import About from "../views/About";
import Login from "../views/Login";
import Setup from "../views/Setup";
import Account from "../views/Account";
import store from "../store";
import PageNotFound from "../views/PageNotFound";
import { IS_SETUP } from "../store/actions/auth";
import { USER_REQUEST } from "../store/actions/user";
import RoleCreate from "../views/RoleCreate";
import UserCreate from "../views/UserCreate";
Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return;
    }
    next("/");
};

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return;
    }
    next("/login");
};

const ifNotInstalled = (to, from, next) => {
    store.dispatch(IS_SETUP).then(() => {
        if (!store.getters.isInstalled) {
            next();
            return;
        } else {
            next("/login");
        }
    });
};

const ifInstalled = (to, from, next) => {
    store.dispatch(IS_SETUP).then(() => {
        if (store.getters.isInstalled) {
            next();
            return;
        } else {
            next("/setup");
        }
    });
};

const ifRoleCreate = (to, from, next) => {
    let permissions = store.getters.getPermissions;
    console.log(permissions);
    if (permissions.indexOf("role-create") !== -1) {
        next();
        return;
    } else {
        next("/");
    }
};

//mode: history gives some problems with dynamic routes used in conjunction with 404 page/redir
//mode: hash works fine but the hashbang is really ugly
//mode: abstract, well, removes the problem, but now each time i reload is just the default page, maybe i can do something with the state?

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Home",
            component: Account,
            beforeEnter: ifAuthenticated
        },
        {
            path: "/about",
            name: "About",
            component: About,
            beforeEnter: ifAuthenticated
        },
        {
            path: "/login",
            name: "Login",
            component: Login,
            beforeEnter: multiguard([ifNotAuthenticated, ifInstalled])
        },
        {
            path: "/setup",
            name: "Setup",
            component: Setup,
            beforeEnter: multiguard([ifNotAuthenticated, ifNotInstalled])
        },
        {
            path: "/role/create",
            name: "Create new Role",
            component: RoleCreate,
            beforeEnter: ifAuthenticated
        },
        {
            path: "/user/create",
            name: "Create a new User",
            component: UserCreate,
            beforeEnter: ifAuthenticated
        }
    ]
});
