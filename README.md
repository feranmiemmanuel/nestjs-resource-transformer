# @jesuferanmi/resource-transformer

A simple utility to transform NestJS models/entities into Laravel-style API resources.

## 📦 Installation

```bash
npm install @jesuferanmi/resource-transformer

## Usage
### Define a Resource
```ts
import { BaseResource } from 'nestjs-resource-transformer';

export class UserResource extends BaseResource {
  toJSON() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
      createdAt: this.resource.createdAt?.toISOString(),
    };
  }
}
```

### Use in Controller
```ts
import { ResourceCollection } from 'nestjs-resource-transformer';
import { UserResource } from './user.resource';

@Get()
findAll(): any {
  const users = this.userService.findAll();
  return new ResourceCollection(users, UserResource).withMeta({ total: users.length });
}
```

## License
MIT

