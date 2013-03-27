{APLArray} = require '../array'
{assert, repeat, prod} = require '../helpers'

@['⍳'] = (omega, alpha) ->
  if alpha
    # Index of (`⍳`)
    #
    #!    2 5 9 14 20 ⍳ 9                           ⍝ returns 1 ⍴ 2
    #!    2 5 9 14 20 ⍳ 6                           ⍝ returns 1 ⍴ 5
    #!    "GORSUCH" ⍳ "S"                           ⍝ returns 1 ⍴ 3
    #!    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ⍳ "CARP"     ⍝ returns 2 0 17 15
    #!    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ⍳ "PORK PIE"
    #!    ... ⍝ returns 15 14 17 10 26 15 8 4
    #!    "MON" "TUES" "WED" ⍳ "MON" "THURS"        ⍝ returns 0 3
    #!    1 3 2 0 3 ⍳ ⍳ 5                           ⍝ returns 3 0 2 1 5
    #!    "CAT" "DOG" "MOUSE" ⍳ "DOG" "BIRD"        ⍝ returns 1 3
    throw Error 'Not implemented'
  else
    # Index generate (`⍳`)
    #
    #     ⍳ 5         ⍝ returns 0 1 2 3 4
    #     ⍴ ⍳ 5       ⍝ returns 1 ⍴ 5
    #     ⍳ 0         ⍝ returns ⍬
    #     ⍴ ⍳ 0       ⍝ returns ,0
    #     ⍳ 2 3 4     ⍝ returns (2 3 4 3 ⍴
    #     ...             0 0 0  0 0 1  0 0 2  0 0 3
    #     ...             0 1 0  0 1 1  0 1 2  0 1 3
    #     ...             0 2 0  0 2 1  0 2 2  0 2 3
    #     ...             1 0 0  1 0 1  1 0 2  1 0 3
    #     ...             1 1 0  1 1 1  1 1 2  1 1 3
    #     ...             1 2 0  1 2 1  1 2 2  1 2 3)
    #     ⍴⍳ 2 3 4    ⍝ returns 2 3 4 3
    if omega.shape.length > 1 then throw Error 'RANK ERROR'
    a = omega.realize()
    for d in a when typeof d isnt 'number' or d isnt Math.floor(d) or d < 0
      throw Error 'DOMAIN ERROR'
    indices = repeat [0], a.length
    data = []
    if prod a
      loop
        data.push indices...
        axis = a.length - 1
        while axis >= 0 and indices[axis] + 1 is a[axis]
          indices[axis--] = 0
        if axis < 0 then break
        indices[axis]++
    new APLArray data, a.concat [a.length]
