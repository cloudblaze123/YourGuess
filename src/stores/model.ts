import { defineStore } from 'pinia'

import { NeuralNetwork } from '@/model/neural-network'


export const useModelStore = defineStore('model', {
    // state
    state: () => ({
        models: {} as Record<string, NeuralNetwork>,
    }),
    
    // actions
    actions: {
        addModel(name:string, model:NeuralNetwork) {
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
