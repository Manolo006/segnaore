data modify storage sd:data items_check set from block ~ ~ ~ Items
data remove storage sd:data items_check[{id:"minecraft:blaze_rod"}]

execute unless data storage sd:data items_check[0] run return 0

data modify storage sd:data type set value "Crafter"
function storage_checker:trigger/process_container
