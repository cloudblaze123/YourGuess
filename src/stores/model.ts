import { defineStore } from 'pinia'

export const useModelStore = defineStore('model', {
    // state
    state: () => ({
        models: {} as Record<string, any>,
    }),
    
    // actions
    actions: {
        addModel(name:string, model:any) {
            this.models[name] = model
        },

        removeModel(name:string) {
            delete this.models[name]
        },

        getModel(name:string) {
            return this.models[name]
        },

        getAllModels() {
            return this.models
        },

        clearModels() {
            this.models = {}
        },

        hasModel(name:string) {
            return name in this.models
        },
    },
})
