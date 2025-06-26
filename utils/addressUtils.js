
export const parseAddress = (addressStr) => {
    const parts = addressStr.split(" ").map(p => p.trim());
    const result = {
      houseNumber: "",
      street: "",
      district: "",
      city: "",
      province: "",
      zip_code: "",
    };
  
  
    if (parts.length >= 5) {
      result.houseNumber = parts[0] || "";
      result.district = parts[1] || "";
      result.city = parts[2] || "";
  
      
      result.street = parts.slice(3, parts.length - 2).join(" ");
  
      result.province = parts[parts.length - 2] || "";
      result.zip_code = parts[parts.length - 1] || "";
    }
  
    return result;
  }

  export default parseAddress;