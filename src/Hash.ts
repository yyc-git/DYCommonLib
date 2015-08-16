/// <reference path="definitions.d.ts"/>
module dyCb {
    export class Hash<T> {
        public static create<T>(children = {}){
            var obj = new this(<{ [s:string]:T }>children);

            return obj;
        }

        constructor(children:{ [s:string]:T } = {}){
            this._children = children;
        }

        private _children:{
            [s:string]:T
        } = null;

        public getChildren() {
            return this._children;
        }

        public getCount(){
            var result = 0,
                children = this._children,
                key = null;

            for(key in children){
                if(children.hasOwnProperty(key)){
                    result++;
                }
            }

            return result;
        }

        public getKeys(){
            var result = Collection.create(),
                children = this._children,
                key = null;

            for(key in children){
                if(children.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }

            return result;
        }

        public getChild(key:string) {
            return this._children[key];
        }

        public setValue(key:string, value:T){
            this._children[key] = value;
        }

        public addChild(key:string, value:T) {
            this._children[key] = value;

            return this;
        }

        public appendChild(key:string, value:any) {
            //if (JudgeUtils.isArray(this._children[key])) {
            //    this._children[key].push(value);
            //}
            //else {
            //    this._children[key] = [value];
            //}
            if (this._children[key] instanceof Collection) {
                let c = <any>(this._children[key]);

                c.addChild(<T>value);
            }
            else {
                this._children[key] = <any>(Collection.create<any>().addChild(value));
            }

            return this;
        }

        public removeChild(arg:any){
            if(JudgeUtils.isString(arg)){
                let key = <string>arg;

                this._children[key] = undefined;
                delete this._children[key];
            }
            else if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg,
                    self = this;

                //return this._removeChild(this._children, arg);
                this.forEach((val, key) => {
                    if(func(val, key)){
                        self._children[key] = undefined;
                        delete self._children[key];
                    }
                });
            }

            return this;
        }

        public removeAllChildren(){
            this._children = {};
        }

        public hasChild(arg:any):boolean {
            if (JudgeUtils.isFunction(arguments[0])) {
                let func = <Function>arguments[0],
                    result = false;

                this.forEach((val, key) => {
                    if(func(val, key)){
                        result = true;
                        return $BREAK;
                    }
                });

                return result;
            }

            let key = <string>arguments[0];

            return !!this._children[key];
        }


        public forEach(func:Function, context?:any){
            var i = null,
                children = this._children;

            for (i in children) {
                if (children.hasOwnProperty(i)) {
                    if (func.call(context, children[i], i) === $BREAK) {
                        break;
                    }
                }
            }

            return this;
        }

        public filter(func:Function){
            var result = {},
                scope = this._children;

            this.forEach((val, key) => {
                if(!func.call(scope, val, key)){
                    return;
                }

                result[key] = val;
            });

            return Hash.create(result);
        }

        public map(func:Function) {
            var resultMap = {};

            this.forEach((val, key) => {
                var result = func(val, key);

                if(result !== $REMOVE){
                    Log.error(!JudgeUtils.isArray(result) || result.length !== 2, Log.info.FUNC_MUST_BE("iterator", "[key, value]"));

                    resultMap[result[0]] = result[1];
                }
            });

            return Hash.create(resultMap);
        }
    }
}


