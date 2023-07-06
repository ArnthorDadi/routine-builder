import os

SEPARATOR = ',|~'
APPARATUS = ["floor", "pommel-horse", "rings", "vault", "parallel-bars", "high-bar"]

elements_file = open(f"./src/elements/Elements.ts", "w+")

# Import images
image_imports = ''
# for apparatus_index, apparatus in enumerate(APPARATUS):
# 	for file_name in os.listdir(f"./src/assets/img/elements/{apparatus}"):
# 		file_name_rest = file_name.split(".")
# 		_, page_nr, __ , row, ___, col = file_name_rest[0].split("-")
# 		image_imports += f"import Element_{page_nr}_{row}_{col} from '@src/assets/img/elements/{apparatus}/{file_name}'\n"

image_imports += 'import { ElementType } from "@src/elements/types";\n'

elements = ''
elements_data = {}
for apparatus_index, apparatus in enumerate(APPARATUS):
# 	if(apparatus_index != 1):
# 		continue
	print(f"{apparatus_index+1}/{len(APPARATUS)}: {apparatus}")
	file_apparatus = open(f"./src/assets/csv/{apparatus}.csv")
	headers = []
	apparatus = apparatus.replace("-", "_")
	if(apparatus == APPARATUS[3]):
		elements += f"\tstatic {apparatus}: Omit<ElementType, 'element_alphabetic_value'>[] = [\n"
	else:
		elements += f"\tstatic {apparatus}: ElementType[] = [\n"
	elements_data[apparatus] = []
	#elements_file.write(f"\tstatic {apparatus} = [\n")
	for index, line in enumerate(file_apparatus):
		line = line.strip()
		if(index == 0):
			headers = line.split(SEPARATOR)
			continue
		data_list = line.split(SEPARATOR)
		element = {}
		for i in range(len(headers)):
			header = headers[i].strip()
			data = data_list[i].strip().replace('"', "'")
			element[header] = data
		elements_data[apparatus].append(element)
	elements_data[apparatus] = sorted(elements_data[apparatus], key=lambda element: element['page_nr'])
	elements_text_list = []

	prev_element_group = ''
	element_nr = 1

	for i, element in enumerate(elements_data[apparatus]):
		element_text_list = []

# 		img = element['img_url']
# 		del element['img_url']
# 		element['img'] = f"Element_{element['page_nr']}_{element['row']}_{element['col']}"
		for key, value in element.items():
			if(key == "group" and prev_element_group != value):
				element_nr = 1
				prev_element_group = value
			if(key == "name"):
				element_text_list.append((f'\t\t{{\n\t\t\t{key}: "{value}"'))
				continue
			elif(key == "element_numeric_value" and value == ""):
				element_text_list.append(f'{key}: 0')
				continue
			elif(key == "element_numeric_value"):
				try:
					element_text_list.append(f'{key}: {float(value)}')
				except:
					element_text_list.append(f'{key}: 0')
				continue
			elif(key == "img_url"):
				split_img = value.split("/")
				element_text_list.append(f'img: "https://raw.githubusercontent.com/ArnthorDadi/CoP/main/img/elements/{apparatus.replace("_", "-")}/{split_img[-1]}"')
				continue
			elif(key == "page_nr" or key == "row" or key == "col"):
				element_text_list.append(f'{key}: {value}')
				continue
			element_text_list.append(f'{key}: "{value}"')

		element_text_list.append(f'elementNr: {element_nr}')
		element_text_list[-1] += '\n\t\t}'
		elements_text_list.append(",\n\t\t\t".join(element_text_list))
		element_nr += 1

	elements += ",\n".join(elements_text_list)
	elements += "\n\t] as unknown as ElementType[]\n"



elements_file.write(f"{image_imports}\n")
# Start elements class
elements_file.write("export class Elements {\n")
elements_file.write(elements)
# close class
elements_file.write("}\n")

elements_file.close()
