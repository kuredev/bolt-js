import type { IncomingMessage, ServerResponse } from 'node:http';
import type { BufferedIncomingMessage } from './receivers/BufferedIncomingMessage';

export interface CodedError extends Error {
  code: string; // This can be a value from ErrorCode, or WebClient's ErrorCode, or a NodeJS error code
  original?: Error; // AuthorizationError, UnknownError
  originals?: Error[]; // MultipleListenerError
  missingProperty?: string; // ContextMissingPropertyError
  req?: IncomingMessage | BufferedIncomingMessage; // HTTPReceiverDeferredRequestError
  res?: ServerResponse; // HTTPReceiverDeferredRequestError
}

// biome-ignore lint/suspicious/noExplicitAny: errors can be anything
export function isCodedError(err: any): err is CodedError {
  return 'code' in err;
}

export enum ErrorCode {
  AppInitializationError = 'slack_bolt_app_initialization_error',

  AssistantInitializationError = 'slack_bolt_assistant_initialization_error',
  AssistantMissingPropertyError = 'slack_bolt_assistant_missing_property_error',

  AuthorizationError = 'slack_bolt_authorization_error',

  ContextMissingPropertyError = 'slack_bolt_context_missing_property_error',
  InvalidCustomPropertyError = 'slack_bolt_context_invalid_custom_property_error',

  CustomRouteInitializationError = 'slack_bolt_custom_route_initialization_error',

  ReceiverMultipleAckError = 'slack_bolt_receiver_ack_multiple_error',
  ReceiverAuthenticityError = 'slack_bolt_receiver_authenticity_error',
  ReceiverInconsistentStateError = 'slack_bolt_receiver_inconsistent_state_error',

  MultipleListenerError = 'slack_bolt_multiple_listener_error',

  HTTPReceiverDeferredRequestError = 'slack_bolt_http_receiver_deferred_request_error',

  /**
   * This value is used to assign to errors that occur inside the framework but do not have a code, to keep interfaces
   * in terms of CodedError.
   */
  UnknownError = 'slack_bolt_unknown_error',

  // TODO: remove workflow step stuff in bolt v5
  WorkflowStepInitializationError = 'slack_bolt_workflow_step_initialization_error',

  CustomFunctionInitializationError = 'slack_bolt_custom_function_initialization_error',
  CustomFunctionCompleteSuccessError = 'slack_bolt_custom_function_complete_success_error',
  CustomFunctionCompleteFailError = 'slack_bolt_custom_function_complete_fail_error',
}

export class UnknownError extends Error implements CodedError {
  public code = ErrorCode.UnknownError;

  public original: Error;

  public constructor(original: Error) {
    super(original.message);

    this.original = original;
  }
}

export function asCodedError(error: CodedError | Error): CodedError {
  if ((error as CodedError).code !== undefined) {
    return error as CodedError;
  }

  return new UnknownError(error);
}

export class AppInitializationError extends Error implements CodedError {
  public code = ErrorCode.AppInitializationError;
}

export class AssistantInitializationError extends Error implements CodedError {
  public code = ErrorCode.AssistantInitializationError;
}

export class AssistantMissingPropertyError extends Error implements CodedError {
  public code = ErrorCode.AssistantMissingPropertyError;
}

export class AuthorizationError extends Error implements CodedError {
  public code = ErrorCode.AuthorizationError;

  public original: Error;

  public constructor(message: string, original: Error) {
    super(message);

    this.original = original;
  }
}

export class ContextMissingPropertyError extends Error implements CodedError {
  public code = ErrorCode.ContextMissingPropertyError;

  public missingProperty: string;

  public constructor(missingProperty: string, message: string) {
    super(message);
    this.missingProperty = missingProperty;
  }
}

export class InvalidCustomPropertyError extends Error implements CodedError {
  public code = ErrorCode.AppInitializationError;
}

export class CustomRouteInitializationError extends Error implements CodedError {
  public code = ErrorCode.CustomRouteInitializationError;
}

export class ReceiverMultipleAckError extends Error implements CodedError {
  public code = ErrorCode.ReceiverMultipleAckError;

  public constructor() {
    super("The receiver's `ack` function was called multiple times.");
  }
}

export class ReceiverAuthenticityError extends Error implements CodedError {
  public code = ErrorCode.ReceiverAuthenticityError;
}

export class ReceiverInconsistentStateError extends Error implements CodedError {
  public code = ErrorCode.ReceiverInconsistentStateError;
}

export class HTTPReceiverDeferredRequestError extends Error implements CodedError {
  public code = ErrorCode.HTTPReceiverDeferredRequestError;

  public req: IncomingMessage | BufferedIncomingMessage;

  public res: ServerResponse;

  public constructor(message: string, req: IncomingMessage | BufferedIncomingMessage, res: ServerResponse) {
    super(message);
    this.req = req;
    this.res = res;
  }
}

export class MultipleListenerError extends Error implements CodedError {
  public code = ErrorCode.MultipleListenerError;

  public originals: Error[];

  public constructor(originals: Error[]) {
    super(
      'Multiple errors occurred while handling several listeners. The `originals` property contains an array of each error.',
    );

    this.originals = originals;
  }
}
/**
 * @deprecated Steps from Apps are no longer supported and support for them will be removed in the next major bolt-js
 * version.
 */
export class WorkflowStepInitializationError extends Error implements CodedError {
  public code = ErrorCode.WorkflowStepInitializationError;
}

export class CustomFunctionInitializationError extends Error implements CodedError {
  public code = ErrorCode.CustomFunctionInitializationError;
}

export class CustomFunctionCompleteSuccessError extends Error implements CodedError {
  public code = ErrorCode.CustomFunctionCompleteSuccessError;
}

export class CustomFunctionCompleteFailError extends Error implements CodedError {
  public code = ErrorCode.CustomFunctionCompleteFailError;
}
