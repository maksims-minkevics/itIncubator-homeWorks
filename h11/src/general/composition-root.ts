import {UserController} from "../models/user/controller";
import {UserRepository} from "../models/user/repository";
import {UserService} from "../models/user/services/userService";
import {SessionRepository} from "../models/session/repositories";
import {SessionService} from "../models/session/services/sessionServices";
import {SessionController} from "../models/session/controller";
import {PostController} from "../models/post/controller";
import {PostsService} from "../models/post/services/postsService";
import {PostsRepository} from "../models/post/repositories";
import {CommentsRepository} from "../models/comment/repositories";
import {CommentsService} from "../models/comment/services/commentService";
import {CommentController} from "../models/comment/controller";
import {BlogsRepository} from "../models/blog/repositories";
import {BlogController} from "../models/blog/controller";
import {BlogsService} from "../models/blog/services/blogService";
import {GenericEmailService} from "./email-service";
import {EmailService} from "../models/user/services/emailService";
import {PasswordService} from "../models/user/services/passwordService";
import {UserBusinessValidator} from "../models/user/middlewares/validations/userBusinessValidator";
import {RegistrationService} from "../models/auth/services/registrationService";
import {JwtTokenService} from "../models/auth/services/jwtTokenService";
import {RefreshTokenService} from "../models/auth/services/refreshTokenService";
import {AuthService} from "../models/auth/services/authService";
import {AuthController} from "../models/auth/controller";
import {LoggingService} from "../models/logs/services/logService";
import {LogRepository} from "../models/logs/repository";

export const passwordServiceInstance = new PasswordService();
export const userRepositoryInstance = new UserRepository();
export const userbizValidatorInstance = new UserBusinessValidator(userRepositoryInstance);
export const userServiceInstance = new UserService(
    userRepositoryInstance,
    userbizValidatorInstance,
    passwordServiceInstance
);
export const userControllerInstance = new UserController(userServiceInstance);

export const sessionRepositoryInstance = new SessionRepository();
export const sessionServiceInstance = new SessionService(sessionRepositoryInstance);
export const sessionControllerInstance = new SessionController(sessionServiceInstance);
export const commentsRepositoryInstance = new CommentsRepository();
export const commentsServiceInstance = new CommentsService(commentsRepositoryInstance);
export const commentsControllerInstance = new CommentController(commentsServiceInstance);

export const blogsRepositoryInstance = new BlogsRepository();
export const blogsServiceInstance = new BlogsService(blogsRepositoryInstance);

export const postsRepositoryInstance = new PostsRepository();
export const postsServiceInstance = new PostsService(postsRepositoryInstance, blogsServiceInstance);
export const blogsControllerInstance = new BlogController(blogsServiceInstance, postsServiceInstance);

export const postsControllerInstance = new PostController(postsServiceInstance, commentsServiceInstance);

export const genericEmailServiceInstance = new GenericEmailService();
export const emailServiceInstance = new EmailService(userServiceInstance, genericEmailServiceInstance);
export const registrationServiceInstance = new RegistrationService(
    userbizValidatorInstance,
    userServiceInstance,
    emailServiceInstance,
    passwordServiceInstance
);
export const jwtTokenServiceInstance = new JwtTokenService();
export const refreshTokenServiceInstance = new RefreshTokenService(sessionServiceInstance);
export const authorizationServiceInstance = new AuthService(
    sessionServiceInstance,
    refreshTokenServiceInstance,
    jwtTokenServiceInstance,
    userServiceInstance,
    passwordServiceInstance,
    emailServiceInstance
);

export const authorizationControllerInstance = new AuthController(
    authorizationServiceInstance,
    userServiceInstance,
    registrationServiceInstance
);

export const requestLoggingRepositoryInstance = new LogRepository();
export const requestLoggingServiceInstance = new LoggingService(requestLoggingRepositoryInstance);

export const instancesList = [
    // User-related instances
    new PasswordService(),
    new UserRepository(),
    new UserBusinessValidator(userRepositoryInstance),
    new UserService(userRepositoryInstance, userbizValidatorInstance, passwordServiceInstance),
    new UserController(userServiceInstance),

    // Session-related instances
    new SessionRepository(),
    new SessionService(sessionRepositoryInstance),
    new SessionController(sessionServiceInstance),

    // Comments-related instances
    new CommentsRepository(),
    new CommentsService(commentsRepositoryInstance),
    new CommentController(commentsServiceInstance),

    // Blogs-related instances
    new BlogsRepository(),
    new BlogsService(blogsRepositoryInstance),

    // Posts-related instances
    new PostsRepository(),
    new PostsService(postsRepositoryInstance, blogsServiceInstance),
    new BlogController(blogsServiceInstance, postsServiceInstance),
    new PostController(postsServiceInstance, commentsServiceInstance),

    // Email-related instances
    new GenericEmailService(),
    new EmailService(userServiceInstance, genericEmailServiceInstance),

    // Registration and Authorization
    new RegistrationService(userbizValidatorInstance, userServiceInstance, emailServiceInstance, passwordServiceInstance),
    new JwtTokenService(),
    new RefreshTokenService(sessionServiceInstance),
    new AuthService(
        sessionServiceInstance,
        refreshTokenServiceInstance,
        jwtTokenServiceInstance,
        userServiceInstance,
        passwordServiceInstance,
        emailServiceInstance
    ),
    new AuthController(authorizationServiceInstance, userServiceInstance, registrationServiceInstance),
    new
    new LoggingService()
];

export const ioc = {
    getInstance<T>(ClassType: new (...args: any[]) => T): T{
        return instancesList.find(instance => instance instanceof ClassType) as T;
    }
};
