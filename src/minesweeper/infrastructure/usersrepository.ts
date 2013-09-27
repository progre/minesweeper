export = usersRepository;
module usersRepository {
    export interface IUser {
        playerId: number;
    }

    /** DB‚È‚ñ‚©–³‚©‚Á‚½ */
    var users: IHash<IUser> = {};

    export function create(userId: string, user: IUser) {
        users[userId] = user;
    }

    export function get(userId: string) {
        if (userId == null)
            return null;
        return users[userId];
    }

    export function put(userId: string, user: IUser) {
        if (userId == null)
            return;
        users[userId] = user;
    }
}

interface IHash<T> {
    [key: string]: T;
}
