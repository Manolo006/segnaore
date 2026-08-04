# ============================================
# Macro to report container with non-blaze-rod items in chat
# Called with: {type: <string>, bx: <int>, by: <int>, bz: <int>, non_blaze_items: <list>}
# ============================================
$tellraw @a[scores={check_storage=1..}] [{"text":"⚠ Found ","color":"gold","bold":true},{"text":"$(type)","color":"white","bold":true},{"text":" at [$(bx), $(by), $(bz)]: ","color":"gray"},{"text":"$(non_blaze_items)","color":"yellow"}]
