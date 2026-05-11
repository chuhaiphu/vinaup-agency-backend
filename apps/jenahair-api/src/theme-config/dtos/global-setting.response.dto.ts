export class GlobalSettingResponseDto<T> {
  id: string;
  key: string;
  value: T;
  updatedAt: Date;
}
