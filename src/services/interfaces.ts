import { JWK } from "jose";
import { Request , Response} from 'express'
import { OpenidForPresentationsConfiguration } from "./types/OpenidForPresentationsConfiguration.type";
import 'reflect-metadata';
import { PresentationClaims, VerifiablePresentationEntity } from "../entities/VerifiablePresentation.entity";
import { SupportedCredentialProtocol } from "../lib/CredentialIssuerConfig/SupportedCredentialProtocol";
import { CredentialView } from "../authorization/types";
import { AuthorizationServerState } from "../entities/AuthorizationServerState.entity";

export interface CredentialSigner {
	sign(payload: any, headers?: any, disclosureFrame?: any): Promise<{ jws: string }>;
	getPublicKeyJwk(): Promise<{ jwk: JWK }>;
}

export interface OpenidForCredentialIssuingAuthorizationServerInterface {
	generateCredentialOfferURL(ctx: { req: Request, res: Response }, credentialConfigurationIds: string[], issuerState?: string): Promise<{ url: URL, user_pin_required?: boolean, user_pin?: string }>;
	metadataRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;
	
	authorizationRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;
	metadataRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;
	authorizationRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;

	sendAuthorizationResponse(ctx: { req: Request, res: Response }, bindedUserSessionId: number): Promise<void>;

	tokenRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;
	credentialRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;
}



export interface OpenidForPresentationsReceivingInterface {
	metadataRequestHandler(ctx: { req: Request, res: Response }): Promise<void>;

	
	getSignedRequestObject(ctx: { req: Request, res: Response }): Promise<any>;
	generateAuthorizationRequestURL(ctx: { req: Request, res: Response }, presentationDefinition: object, directPostEndpoint?: string): Promise<{ url: URL; stateId: string }>;
	getPresentationDefinitionHandler(ctx: { req: Request, res: Response }): Promise<void>;
	getPresentationByState(state: string): Promise<{ status: true, vp: VerifiablePresentationEntity } | { status: false }>;
	getPresentationById(id: string): Promise<{ status: boolean, presentationClaims?: PresentationClaims, rawPresentation?: string }>;
	
	/**
	 * @throws
	 * @param req 
	 * @param res 
	 */
	responseHandler(ctx: { req: Request, res: Response }): Promise<void>;

}


export interface VerifierConfigurationInterface {
	getConfiguration(): OpenidForPresentationsConfiguration;
	getPresentationDefinitions(): any[];
}


export interface CredentialReceiving {
	sendAuthorizationRequest(): Promise<void>;
}



export interface CredentialConfigurationRegistry {
	register(credentialConfiguration: SupportedCredentialProtocol): void;

	getAllRegisteredCredentialConfigurations(): SupportedCredentialProtocol[];

	/**
	 * At the moment, an authorization flow can only return a single credential type.
	 * 
	 * This function will get an authorization server state as parameter and use every registered credential configuration to
	 * get the CredentialView. If no credential view is found, the return value will be null
	 * @param authorizationServerState 
	 */
	getCredentialView(authorizationServerState: AuthorizationServerState): Promise<CredentialView | null>;

		/**
	 * At the moment, an authorization flow can only return a single credential type.
	 * 
	 * This function will get an authorization server state as parameter and use every registered credential configuration to
	 * get the raw credential response. If the authorizationServerState data is not sufficient the return value will be null
	 * @param authorizationServerState 
	 */
	getCredentialResponse(authorizationServerState: AuthorizationServerState, credentialRequest: Request, holderPublicKeyToBind: JWK): Promise<any | null>;
}

export interface CredentialDataModel {
	getImage(rawCredential: any): Promise<{ uri: string }>;
	getCredentialName(rawCredential: any): Promise<{ name: string }>;
	parse(rawCredential: any): Promise<{ data: any }>;
}

export interface CredentialDataModelRegistry extends CredentialDataModel {
	register(dm: CredentialDataModel): void;
}