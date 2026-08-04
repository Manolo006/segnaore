data remove storage sd:data current_slot
execute store result storage sd:data current_slot.count int 1 run data get block ~ ~ ~ Items[{Slot:2b}].count
execute unless data storage sd:data current_slot.count store result storage sd:data current_slot.count int 1 run data get block ~ ~ ~ Items[{Slot:2b}].Count
data modify storage sd:data current_slot.id set from block ~ ~ ~ Items[{Slot:2b}].id
function storage_checker:check/append_item with storage sd:data current_slot
