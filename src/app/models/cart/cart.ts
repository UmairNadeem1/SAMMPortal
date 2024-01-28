export class Cart {
  recipe_id: number = 0;
  recipe_name: string = "";
  recipe_type: number = 0;
  recipe_temperature: number = 0;
  recipe_description: string = "";
  recipe_pic: string =
    "https://sammmedia.s3.ap-southeast-2.amazonaws.com/photo";
  isListed: boolean = false;
  created_by: string = "";
  total_price:number = 0;
}
