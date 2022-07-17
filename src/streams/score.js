const {mult, map: fmap, some, when, constant, lt} = require('@customcommander/functionaut');
const {fromEventPattern} = require('rxjs');
const {map, distinct} = require('rxjs/operators');

const countUnusedSpaces = ctx =>
  Object.values(ctx.spaces).filter(sp => sp.type == 'unused').length;

const scoreUnusedSpaces = n => n * -1;

const count_grain = ctx => {
  const in_reserve = ctx.reserve.grain;
  const in_fields = Object.values(ctx.spaces).filter(sp => sp.type == 'field' && sp.grain > 0).length;
  return in_reserve + in_fields;
};

const score_grain = some( when(lt(1), constant(-1))
                        , when(lt(4), constant( 1))
                        , when(lt(7), constant( 2))
                        , when(lt(8), constant( 3))
                        ,             constant( 4));

const scoreMap = {
  family: [ctx => ctx.numWorkers, mult(3)],
  unusedSpaces: [countUnusedSpaces, scoreUnusedSpaces],
  grain: [count_grain, score_grain]
};

module.exports = service =>
  fromEventPattern(handler => service.onChange(handler))
    .pipe( map(([ctx]) => fmap(([f, g, ...meta]) => [f(ctx), g(f(ctx)), ...meta], scoreMap))
         , distinct(o => JSON.stringify(o)));
