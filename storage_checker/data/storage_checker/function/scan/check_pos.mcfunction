# Check if this position has a hopper or smoker
execute if block ~ ~ ~ minecraft:hopper run function storage_checker:check/hopper
execute if block ~ ~ ~ minecraft:smoker run function storage_checker:check/smoker
