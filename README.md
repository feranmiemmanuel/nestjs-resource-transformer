# @jesuferanmi/resource-transformer

A simple utility to transform NestJS models/entities into Laravel-style API resources.

## 📦 Installation

```bash
npm install @jesuferanmi/resource-transformer

## Usage
### Define a Resource
#### Create a class extending BaseResource to define how your model/entity should be transformed:
```ts
import { BaseResource } from '@jesuferanmi/resource-transformer';

export class UserResource extends BaseResource {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
      createdAt: this.resource.createdAt?.toISOString(),

      // Conditionally include data
      isActive: this.when(this.resource.isActive, true),

      // Include related resource only if loaded
      profile: this.whenLoaded('profile', ProfileResource),
    };
  }
}
```
- Override `toArray()` to specify your transformation logic.
- Use `when(condition, value)` to conditionally include attributes.
- Use `whenLoaded(relationName, ResourceClass)` to include related resources only if they are loaded.
- Add extra metadata or data by calling `additional()`.

```ts
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    return new UserResource(user)
      .additional({ 
        requestTimestamp: new Date().toISOString(),
        customMeta: 'extra info here',
      })
      .toJSON();
  }
```
This will return a response like:

```json
  {
    "data": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2025-06-09T12:34:56.789Z",
      "isActive": true,
      "profile": { /* related profile data */ }
    },
    "customMeta": "extra info here",
    "requestTimestamp": "2025-06-09T14:00:00.000Z"
  }
```

### Use in Controller
```ts
import { ResourceCollection } from '@jesuferanmi/resource-transformer';
import { UserResource } from './user.resource';

@Get()
async findAll(
  @Query('page') page = '1',
  @Query('per_page') perPage = '10',
) {
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);
  const skip = (pageNum - 1) * perPageNum;

  // Example: Use your ORM's pagination method to get data and total count
  const [users, total] = await this.userService.paginate({ skip, take: perPageNum });

  // Create the resource collection and add pagination meta
  return new ResourceCollection(users, UserResource)
    .withMeta({
      total,
      per_page: perPageNum,
      current_page: pageNum,
      last_page: Math.ceil(total / perPageNum),
    })
    .toResponse();
}
```
- Use ResourceCollection to transform arrays of models.

- Call .withMeta() to attach pagination or other metadata.

- Call .toResponse() to get the full response object { data, meta }.

Additional Features
  - Conditional attributes: Use when(condition, value) to include fields only if a condition is met.

  - Relations: Use whenLoaded(relationName, ResourceClass) to transform related entities only if loaded.

  - Additional metadata: Add custom meta data to resources or collections via additional().

  - Flexible: Works with any ORM or data source that returns objects or arrays.

## License
MIT

