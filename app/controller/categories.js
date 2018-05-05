let BaseController = require('./base');
module.exports = class CategoriesController extends BaseController {
    //查询分类
    async index() {
        try {
            let items = await this.getPager('Category', ['name'])
            this.success({ items });
        } catch (error) {
            this.error(error);
        }
    }
    //增加文章分类
    async create() {
        let { ctx } = this;
        let category = ctx.request.body;
        try {
            let doc = await ctx.model.Category.findOne(category);
            if (doc) {
                this.error('此分类已经存在!');
            } else {
                doc = await ctx.model.Category.create(category);
                this.success('保存分类成功');
            }
        } catch (error) {
            this.error(error);
        }
    }

    async update() {
        let { ctx } = this;
        let id = ctx.params.id;
        let category = ctx.request.body;//{name:new}
        try {
            let result = await ctx.model.Category.findByIdAndUpdate(id, category);
            this.success('更新成功');
        } catch (eror) {
            this.error(error);
        }
    }
    async destroy() {
        let { ctx } = this;
        let id = ctx.params.id;
        try {
            await ctx.model.Category.findByIdAndRemove(id);
            this.success('删除成功');
        } catch (error) {
            this.error(error);
        }
    }
}