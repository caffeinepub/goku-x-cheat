import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    features: Array<string>;
    name: string;
    isActive: boolean;
    videoUrl: string;
}
export type ComplaintStatus = { open: null } | { replied: null };
export interface Complaint {
    id: bigint;
    caller: Principal;
    name: string;
    subject: string;
    message: string;
    timestamp: bigint;
    status: ComplaintStatus;
    adminReply: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateVerificationCode(email: string): Promise<string>;
    getActiveProducts(): Promise<Array<Product>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllComplaints(): Promise<Array<Complaint>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductById(productId: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitCount(): Promise<bigint>;
    incrementVisitCounter(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    replyToComplaint(complaintId: bigint, reply: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitComplaint(name: string, subject: string, message: string): Promise<bigint>;
    updateProduct(productId: bigint, product: Product): Promise<void>;
    verifyCode(email: string, code: string): Promise<boolean>;
}
