export interface IRequestInstanceDTO<T> {
  toDO(): T;
}

export interface IRequestDTO<T> {
  fromBody(body: unknown): IRequestInstanceDTO<T>;
}


export interface IResponseInstanceDTO {
  toBody(): unknown;
}

export interface IResponseDTO<T> {
  fromDO(domainObject: T): IResponseInstanceDTO;
}
