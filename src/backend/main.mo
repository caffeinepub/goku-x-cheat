import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Product = {
    id : Nat;
    name : Text;
    features : [Text];
    videoUrl : Text;
    isActive : Bool;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : { #less; #equal; #greater } {
      Nat.compare(p1.id, p2.id);
    };
  };

  var productEntries : [(Nat, Product)] = [];
  let products = Map.fromIter<Nat, Product>(productEntries.vals());
  var nextProductId = 1;

  type VerificationCode = { code : Text; timestamp : Int; };
  let verificationCodes = Map.empty<Text, VerificationCode>();

  var visitCounter = 0;

  public type UserProfile = { name : Text; };

  var userProfileEntries : [(Principal, UserProfile)] = [];
  let userProfiles = Map.fromIter<Principal, UserProfile>(userProfileEntries.vals());

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized");
    };
    let newProduct : Product = { product with id = nextProductId; };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized");
    };
    if (not products.containsKey(productId)) { Runtime.trap("Not found"); };
    products.add(productId, { product with id = productId; });
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getActiveProducts() : async [Product] {
    products.values().filter(func(p) { p.isActive }).sort().toArray();
  };

  public query func getProductById(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public func generateVerificationCode(email : Text) : async Text {
    let code = Int.abs(Time.now()) % 900000 + 100000;
    let vc : VerificationCode = { code = code.toText(); timestamp = Time.now(); };
    verificationCodes.add(email, vc);
    vc.code;
  };

  public func verifyCode(email : Text, code : Text) : async Bool {
    switch (verificationCodes.get(email)) {
      case (null) { false };
      case (?vc) { vc.code == code };
    };
  };

  public shared ({ caller }) func incrementVisitCounter() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    visitCounter += 1;
    visitCounter;
  };

  public query func getVisitCount() : async Nat { visitCounter; };

  system func preupgrade() {
    productEntries := products.entries().toArray();
    userProfileEntries := userProfiles.entries().toArray();
  };

  system func postupgrade() {
    if (products.size() == 0) {
      let seed : [(Text, [Text], Text)] = [
        ("\u{1F534} PANEL V3",
          ["\u{1F525} Aimbot avancado", "\u{1F3AF} Anti-ban integrado", "\u{1F4A5} ESP inimigos", "\u{26A1} Speed hack"],
          "https://cdn.discordapp.com/attachments/1468957940449808404/1477692554568011857/v3.mp4"),
        ("\u{1F534} AIM KILL COVER",
          ["\u{1F3AF} Aim kill preciso", "\u{1F4A5} Cover automatico", "\u{26A1} Reacao rapida", "\u{1F510} Modo oculto"],
          "https://cdn.discordapp.com/attachments/1468957932904386744/1481928563467747370/aim_kill_cover_dc.mp4"),
        ("\u{1F534} UID BYPASS",
          ["\u{1F512} Bypass de UID", "\u{1F6E1} Anti-deteccao", "\u{1F525} Funciona no ranked", "\u{26A1} Updates constantes"],
          "https://cdn.discordapp.com/attachments/1468957935324500159/1476064007512395786/Tutorial.mp4"),
        ("\u{1F534} SILENT AIM",
          ["\u{1F3AF} Silent aim invisivel", "\u{1F4A5} Headshot automatico", "\u{1F510} Indetectavel", "\u{26A1} Alta precisao"],
          "https://cdn.discordapp.com/attachments/1468957934213140582/1483848520187379762/aimsilent_dc.mp4"),
        ("\u{1F534} INTERNAL PANEL",
          ["\u{1F525} Painel interno completo", "\u{1F3AF} ESP + Aimbot + Speed", "\u{1F512} Maximo de seguranca", "\u{26A1} Updates automaticos"],
          "https://cdn.discordapp.com/attachments/1468957936729460788/1483832711524257813/internal_new_dc.mp4")
      ];
      var pid = nextProductId;
      for ((name, features, videoUrl) in seed.vals()) {
        products.add(pid, { id = pid; name; features; videoUrl; isActive = true; });
        pid += 1;
      };
      nextProductId := pid;
    };
  };
};
