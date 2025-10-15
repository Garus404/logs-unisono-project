
"use client";

import React from 'react';

const USER_STORAGE_KEY = 'loggedInUser';

export const useSessionManager = () => {
    const [currentUser, setCurrentUser] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Загружаем пользователя при монтировании компонента
        const user = localStorage.getItem(USER_STORAGE_KEY);
        setCurrentUser(user);

        // Обработчик для выхода при закрытии вкладки
        const handleBeforeUnload = () => {
            localStorage.removeItem(USER_STORAGE_KEY);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Очистка при размонтировании
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const login = (username: string) => {
        localStorage.setItem(USER_STORAGE_KEY, username);
        setCurrentUser(username);
    };

    const logout = () => {
        localStorage.removeItem(USER_STORAGE_KEY);
        setCurrentUser(null);
    };

    return { currentUser, login, logout };
};
