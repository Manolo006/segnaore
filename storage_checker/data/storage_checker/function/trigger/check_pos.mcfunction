# Align to block integer coords for container checks
execute align xyz if block ~ ~ ~ minecraft:hopper run function storage_checker:trigger/check_hopper
execute align xyz if block ~ ~ ~ minecraft:smoker run function storage_checker:trigger/check_smoker
execute align xyz if block ~ ~ ~ minecraft:crafter run function storage_checker:trigger/check_crafter
