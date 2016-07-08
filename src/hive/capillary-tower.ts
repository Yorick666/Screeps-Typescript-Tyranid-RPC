export enum CapillaryTowerState {Growing, Active, Full}
export class CapillaryTower {
    get biomass():number {
        return this._biomass;
    }
    get biomassCapacity():number {
        return this._biomassCapacity;
    }
    private storage:Storage;
    private _state:CapillaryTowerState;

    get state():CapillaryTowerState {
        return this._state;
    }

    private _biomass:number;
    private _biomassCapacity:number;

    constructor(storage:Storage) {
        this.storage = storage;
        if (!storage) {
            this._state = CapillaryTowerState.Growing;
            this._biomass = 0;
            this._biomassCapacity = 0;
        } else {
            this._state = CapillaryTowerState.Active;
            this._biomass = storage.store[RESOURCE_ENERGY];
            this._biomassCapacity = storage.storeCapacity;

            if (this._biomass == this._biomassCapacity) {
                this._state = CapillaryTowerState.Full;
            }
        }
    }
}