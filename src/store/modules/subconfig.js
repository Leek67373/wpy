export default {
    state: {
        subconfig: {
            step: 0,
            apiInfo: {},
            channelInfo: []
        }
    },
    mutations: {
        setStep ({subconfig}) {
            subconfig.step += 1
        },
        setApiInfo ({subconfig}, info) {
            subconfig.apiInfo = info
        },
        setChannelInfo ({subconfig}, info) {
            subconfig.channelInfo = info
        },
        resetStep ({subconfig}) {
            subconfig.step = 0
        },
        copyConfigStep ({subconfig}) {
            subconfig.step = 1
        },
        gobackStep ({subconfig}, info) {
            subconfig.step -= 1
        }
    },
    getters: {
        getStep: ({subconfig}) => subconfig.step,
        apiInfo: ({subconfig}) => subconfig.apiInfo,
        channelInfo: ({subconfig}) => subconfig.channelInfo
    }
}