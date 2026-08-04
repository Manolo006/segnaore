# ============================================
# Macro to append "count x id" string to items list
# Called with: {count: <int>, id: <string>}
# ============================================
$data modify storage sd:data items append value "$(count)x $(id)"
