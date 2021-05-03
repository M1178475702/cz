const Service = require('../../core/service/ApiService');


class ConfigService extends Service{

    async getConfigById(config_id){
        const config = await this.model.XdXdConfig.findOne({
            where: {
                config_id: config_id
            },
            raw: true
        });
        return config.config_content;
    }


}

module.exports = ConfigService;
