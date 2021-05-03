const {Service} = require('egg');

class ApiService extends Service {
    constructor(self) {
        super(self);
    }

    //将事务挂在ctx上,供全局访问
    //维护一个quote，作为transaction在service中的方法中，被引用的次数，当且为1时，进行真正的commit与rollback
    //没有办法并发事务
    async getTransaction() {
        await this.ctx.getTransaction();
    }
    async rollback(){
        await this.ctx.rollback();
    }
    async commit(){
        await this.ctx.commit();
    }

    async getIdpTransacation(){
        return this.model.transaction();
    }

    get model() {
        return this.app.model;
    }

    get knex(){
        return this.app.knex;
    }

    get helper(){
        return this.ctx.helper;
    }

    get constant() {
        return this.app.constant;
    }

    get error() {
        return this.app.error;
    }
}

module.exports = ApiService;
