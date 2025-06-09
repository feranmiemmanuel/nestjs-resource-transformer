export abstract class BaseResource<T = any> {
  constructor(protected resource: T) {}

  abstract toJSON(): Record<string, any>;

  protected when(condition: boolean, value: any): any {
    return condition ? value : undefined;
  }
}