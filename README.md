# @jesuferanmi/resource-transformer

A simple utility to transform NestJS models/entities into Laravel-style API resources.

## 📦 Installation

```bash
npm install @jesuferanmi/resource-transformer

## Usage
### Define a Resource
```ts
import { BaseResource } from '@jesuferanmi/resource-transformer';

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
import { ResourceCollection } from '@jesuferanmi/resource-transformer';
import { UserResource } from './user.resource';

@Get()
findAll(): any {
  const users = this.userService.findAll();
  return new ResourceCollection(users, UserResource).withMeta({ total: users.length });
}

// pagination example
@Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10'
  ) {
    const pageNum = parseInt(page, 10);
    const perPageNum = parseInt(perPage, 10);
    const skip = (pageNum - 1) * perPageNum;

    // ORM-based pagination
    const [users, total] = await this.userService.paginate({
      skip,
      take: perPageNum,
    });

    return new ResourceCollection(users, UserResource).withMeta({
      total,
      per_page: perPageNum,
      current_page: pageNum,
      last_page: Math.ceil(total / perPageNum),
    });
  }
```

## License
MIT

