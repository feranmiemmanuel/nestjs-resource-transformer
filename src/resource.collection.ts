import { BaseResource } from './base.resource';

export class ResourceCollection<T = any> {
  private additionalMeta: Record<string, any> = {};

  constructor(
    private resources: T[],
    private ResourceClass: new (item: T) => BaseResource<T>,
  ) {}

  /**
   * Transform the collection of resources into an array of JSON objects
   */
  toJSON(): any[] {
    return this.resources.map(item => new this.ResourceClass(item).toJSON());
  }

  /**
   * Add or merge additional metadata to the collection response
   */
  withMeta(meta: Record<string, any>) {
    this.additionalMeta = { ...this.additionalMeta, ...meta };
    return this;
  }

  /**
   * Return the full collection response with data and metadata
   */
  toResponse() {
    return {
      data: this.toJSON(),
      meta: this.additionalMeta,
    };
  }
}
