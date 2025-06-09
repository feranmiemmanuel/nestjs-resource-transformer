export abstract class BaseResource<T = any> {
  protected additionalData: Record<string, any> = {};

  constructor(protected resource: T) {}

  /**
   * Transform the resource into a plain object.
   * Must be implemented by child classes.
   */
  abstract toArray(): Record<string, any>;

  /**
   * Convert the resource to JSON, merging additional data.
   */
  toJSON(): Record<string, any> {
    return {
      ...this.toArray(),
      ...this.additionalData,
    };
  }

  /**
   * Conditionally include a value if condition is true.
   */
  protected when(condition: boolean, value: any, defaultValue: any = undefined): any {
    return condition ? value : defaultValue;
  }

  /**
   * Include related resource only if relation is loaded (exists).
   * Handles both single object and array of objects.
   */
  protected whenLoaded<R>(
    relation: string,
    ResourceClass: new (resource: any) => BaseResource<R>,
  ): object | object[] | null {
    const related = (this.resource as any)?.[relation];

    if (related === undefined || related === null) {
      return null;
    }

    if (Array.isArray(related)) {
      return related.map(item => new ResourceClass(item).toArray());
    }

    return new ResourceClass(related).toArray();
  }

  /**
   * Add extra data to merge into final output.
   */
  additional(data: Record<string, any>) {
    this.additionalData = { ...this.additionalData, ...data };
    return this;
  }
}
