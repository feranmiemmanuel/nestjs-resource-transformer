import { BaseResource } from './base.resource';

export class ResourceCollection<T = any> {
  constructor(
    private resources: T[],
    private ResourceClass: new (item: T) => BaseResource<T>,
  ) {}

  toJSON(): any[] {
    return this.resources.map(
      item => new this.ResourceClass(item).toJSON(),
    );
  }

  withMeta(meta: Record<string, any>) {
    return {
      data: this.toJSON(),
      meta,
    };
  }
}