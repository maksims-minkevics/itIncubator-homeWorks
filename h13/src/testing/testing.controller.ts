import { HTTP_STATUS } from '../general/general.consts';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PostsRepository } from '../post/post.repository';
import { BlogRepository } from '../blog/blog.repository';

@Controller('/testing/all-data')
export class TestingController {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogRepository,
  ) {}
  @Delete()
  @HttpCode(HTTP_STATUS.NO_CONTENT)
  async deleteAllData() {
    await this.blogsRepository.dropDb();
    await this.postsRepository.dropDb();
  }
}
