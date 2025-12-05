import SimpleMap from "./SimpleMap.jsx";
import useGeocodedLocation from "../hooks/useGeocodedLocation.js";

const DEFAULT_RESTAURANT = {
  lat: 10.776492,
  lng: 106.700414,
  label: "FCO Drinks Lounge",
};

const DEFAULT_CUSTOMER_HINT = {
  lat: 10.776829,
  lng: 106.703333,
};

function MapPreview({ address }) {
  const { coords, status, error } = useGeocodedLocation(address, DEFAULT_CUSTOMER_HINT);

  const markers = [
    {
      id: "origin",
      label: DEFAULT_RESTAURANT.label,
      subLabel: "Điểm lấy hàng",
      lat: DEFAULT_RESTAURANT.lat,
      lng: DEFAULT_RESTAURANT.lng,
      type: "origin",
    },
  ];

  if (coords) {
    markers.push({
      id: "destination",
      label: "Địa chỉ giao",
      subLabel: address || "Đang chờ địa chỉ...",
      lat: coords.lat,
      lng: coords.lng,
      type: "destination",
    });
  }

  const mapCenter = coords ?? { lat: DEFAULT_RESTAURANT.lat, lng: DEFAULT_RESTAURANT.lng };
  const path = coords
    ? [
        { lat: DEFAULT_RESTAURANT.lat, lng: DEFAULT_RESTAURANT.lng },
        { lat: coords.lat, lng: coords.lng },
      ]
    : [];

  return (
    <div className="order-map-card">
      <div className="order-map-card__header">
        <div>
          <h4>Bản đồ giao hàng trực tuyến</h4>
          <p>
            Bản đồ cập nhật tự động theo địa chỉ bạn nhập. Drone sẽ bay theo tuyến đường ngắn nhất từ
            quán đến vị trí của bạn.
          </p>
        </div>
        <div className={`order-map-card__status order-map-card__status--${status}`}>
          {status === "loading" && "Đang định vị..."}
          {status === "success" && "Đã tìm thấy vị trí"}
          {status === "error" && "Không tìm thấy, dùng vị trí gần nhất"}
          {status === "idle" && "Nhập địa chỉ để xem bản đồ"}
        </div>
      </div>
      <div className="order-map-card__map">
        <SimpleMap
          center={mapCenter}
          markers={markers}
          path={path}
          loading={status === "loading"}
          height={300}
        />
      </div>
      {error && <p className="order-map-card__error">{error}</p>}
    </div>
  );
}

export default MapPreview;
