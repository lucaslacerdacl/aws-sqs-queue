import {RequestModel} from './request.model';

export interface MessageModel {
  url: string;
  module: string;
  method: string;
  body: {
    content: RequestModel;
    errorCallback: RequestModel;
    successCallback?: RequestModel | undefined;
  };
}
